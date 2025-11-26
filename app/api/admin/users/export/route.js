import { NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth';
import connectDB from '@/lib/mongodb';
import User from '@/lib/models/User';

// POST export users data
export async function POST(request) {
  try {
    await requireAdmin(request);
    await connectDB();

    const { userIds, format = 'csv' } = await request.json();

    // Build query
    let query = {};
    if (userIds && userIds.length > 0) {
      query = { _id: { $in: userIds } };
    }

    // Fetch users
    const users = await User.find(query).select('-password -otp -otpExpires');

    if (format === 'csv') {
      // Generate CSV
      const headers = ['First Name', 'Last Name', 'Email', 'Phone', 'Email Verified', 'Active', 'Role', 'Created At', 'Updated At'];
      const csvRows = [headers.join(',')];

      users.forEach(user => {
        const row = [
          `"${user.firstName || ''}"`,
          `"${user.lastName || ''}"`,
          `"${user.email || ''}"`,
          `"${user.phone || ''}"`,
          user.isEmailVerified ? 'Yes' : 'No',
          user.isActive ? 'Yes' : 'No',
          `"${user.role || 'customer'}"`,
          `"${user.createdAt?.toISOString() || ''}"`,
          `"${user.updatedAt?.toISOString() || ''}"`
        ];
        csvRows.push(row.join(','));
      });

      const csvContent = csvRows.join('\n');
      
      return new NextResponse(csvContent, {
        headers: {
          'Content-Type': 'text/csv',
          'Content-Disposition': `attachment; filename=users-export-${new Date().toISOString().split('T')[0]}.csv`
        }
      });

    } else if (format === 'json') {
      // Generate JSON
      const exportData = {
        exportedAt: new Date().toISOString(),
        totalUsers: users.length,
        users: users.map(user => ({
          id: user._id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          phone: user.phone,
          isEmailVerified: user.isEmailVerified,
          isActive: user.isActive,
          role: user.role,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt
        }))
      };

      return new NextResponse(JSON.stringify(exportData, null, 2), {
        headers: {
          'Content-Type': 'application/json',
          'Content-Disposition': `attachment; filename=users-export-${new Date().toISOString().split('T')[0]}.json`
        }
      });

    } else {
      return NextResponse.json(
        { error: 'Invalid format. Supported formats: csv, json' },
        { status: 400 }
      );
    }

  } catch (error) {
    console.error('Error exporting users:', error);
    return NextResponse.json(
      { error: 'Failed to export users data' },
      { status: 500 }
    );
  }
}
