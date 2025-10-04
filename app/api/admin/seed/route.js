import { seedAdmin } from '@/lib/seed-admin';
import { RequireAdmin } from '@/components/ProtectedRoute';

export async function POST() {
  // This endpoint is accessible without authentication for initial setup
  try {
    const adminUser = await seedAdmin();
    
    return Response.json({
      message: 'Admin user seeded successfully',
      admin: {
        email: adminUser.email,
        firstName: adminUser.firstName,
        lastName: adminUser.lastName,
        role: adminUser.role,
      },
    });
    
  } catch (error) {
    console.error('Seed admin error:', error);
    return Response.json(
      { error: 'Failed to seed admin user' },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const adminUser = await seedAdmin();
    
    return Response.json({
      message: 'Admin user status',
      admin: {
        email: adminUser.email,
        firstName: adminUser.firstName,
        lastName: adminUser.lastName,
        role: adminUser.role,
        isEmailVerified: adminUser.isEmailVerified,
      },
    });
    
  } catch (error) {
    console.error('Check admin status error:', error);
    return Response.json(
      { error: 'Failed to check admin status' },
      { status: 500 }
    );
  }
}
