import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import jwt from 'jsonwebtoken';

export interface UserPayload {
  id: string;
  username: string;
  role: 'STUDENT' | 'STAFF' | 'ADMIN';
  origIat?: number;
}

export const verifyToken = (token: string): UserPayload => {
  try {
    return jwt.verify(token, process.env.JWT_SECRET!) as UserPayload;
  } catch {
    throw new Error('Invalid token');
  }
};

export const requireAuth = async (allowedRoles: UserPayload['role'][]) => {
  const cookieStore = await cookies();
  const token = cookieStore.get('token')?.value;

//   console.log('Token:', token); // Debugging line
//   console.log('Allowed Roles:', allowedRoles); // Debugging line
  
  if (!token) {
    // console.log('No token found'); // Debugging line
    redirect('/login');
  }

  try {
    const user = verifyToken(token);
    // console.log('User:', user); // Debugging line
    if (!allowedRoles.includes(user.role)) {
        // console.log('User role not allowed:', user.role); // Debugging line
        redirect('/')};
    return user;
  } catch {
    // console.log('Token verification failed'); // Debugging line
    redirect('/login');
  }
};