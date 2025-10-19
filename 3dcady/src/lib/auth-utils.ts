import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { SUBSCRIPTION_LIMITS } from '@/lib/constants';
import { RoleType, SubscriptionPlan } from '@/generated/prisma';
import bcrypt from 'bcryptjs';

export async function getCurrentUser() {
  const session = await auth();
  return session?.user;
}

export async function requireAuth() {
  const user = await getCurrentUser();
  if (!user) {
    throw new Error('Authentication required');
  }
  return user;
}

export async function requireRole(allowedRoles: RoleType[]) {
  const user = await requireAuth();
  if (!allowedRoles.includes(user.role)) {
    throw new Error('Insufficient permissions');
  }
  return user;
}

export async function checkSubscriptionLimit(
  userId: string,
  limitType: keyof typeof SUBSCRIPTION_LIMITS.free
) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { subscriptionPlan: true },
  });

  if (!user) {
    throw new Error('User not found');
  }

  const limits = SUBSCRIPTION_LIMITS[user.subscriptionPlan];
  const limit = limits[limitType];

  // -1 means unlimited
  if (limit === -1) {
    return true;
  }

  // Check current usage based on limit type
  let currentUsage = 0;

  switch (limitType) {
    case 'maxProjects':
      currentUsage = await prisma.project.count({
        where: { ownerId: userId },
      });
      break;
    
    case 'maxFileStorageGB':
      const totalStorage = await prisma.fileUpload.aggregate({
        where: { uploadedBy: userId },
        _sum: { sizeBytes: true },
      });
      currentUsage = Number(totalStorage._sum.sizeBytes || 0) / (1024 * 1024 * 1024); // Convert to GB
      break;
    
    // Add other limit checks as needed
    default:
      return true;
  }

  return currentUsage < (limit as number);
}

export async function hashPassword(password: string): Promise<string> {
  const saltRounds = 12;
  return bcrypt.hash(password, saltRounds);
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export async function createUser(data: {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  roleType: RoleType;
  companyName?: string;
}) {
  const existingUser = await prisma.user.findUnique({
    where: { email: data.email },
  });

  if (existingUser) {
    throw new Error('User already exists');
  }

  const passwordHash = await hashPassword(data.password);

  const user = await prisma.user.create({
    data: {
      email: data.email,
      passwordHash,
      firstName: data.firstName,
      lastName: data.lastName,
      roleType: data.roleType,
      subscriptionPlan: 'FREE',
      companyName: data.companyName,
    },
  });

  // Create supplier profile if role is supplier
  if (data.roleType === 'SUPPLIER') {
    await prisma.supplierProfile.create({
      data: {
        userId: user.id,
        companyRegistration: '', // To be filled later
        description: '',
        categories: [],
        serviceAreas: [],
        verificationStatus: 'PENDING',
      },
    });
  }

  return user;
}

export function getSubscriptionLimits(plan: SubscriptionPlan) {
  return SUBSCRIPTION_LIMITS[plan];
}

export async function canUserAccessProject(userId: string, projectId: string): Promise<boolean> {
  const permission = await prisma.userPermission.findFirst({
    where: {
      userId,
      projectId,
    },
  });

  if (permission) {
    return true;
  }

  // Check if user is the project owner
  const project = await prisma.project.findFirst({
    where: {
      id: projectId,
      ownerId: userId,
    },
  });

  return !!project;
}

export async function getUserProjectAccess(userId: string, projectId: string) {
  const project = await prisma.project.findFirst({
    where: { id: projectId },
    include: {
      permissions: {
        where: { userId },
      },
    },
  });

  if (!project) {
    return null;
  }

  // If user is owner, they have admin access
  if (project.ownerId === userId) {
    return {
      project,
      accessLevel: 'ADMIN' as const,
      isOwner: true,
    };
  }

  // Check permission level
  const permission = project.permissions[0];
  if (!permission) {
    return null;
  }

  return {
    project,
    accessLevel: permission.accessLevel,
    isOwner: false,
  };
}