import prisma from "@/lib/prisma";

export async function POST(request: Request) {


  try {
    const { username, verifyCode } = await request.json();
    const decodedUsername = decodeURIComponent(username);
    const user = await prisma.user.findUnique({ where: { username: decodedUsername } });

    if (!user) {
      return Response.json(
        { success: false, message: 'User not found' },
        { status: 404 }
      );
    }

    const isCodeValid = user.emailVerifyCode === verifyCode;
    
    const isCodeNotExpired = new Date(user.verifyCodeExpiry) > new Date();

    if (isCodeValid && isCodeNotExpired) {
        await prisma.user.update({
            where: { username: decodedUsername },
            data: { isEmailVerified: true },
        });

      return Response.json(
        { success: true, message: 'Account verified successfully' },
        { status: 200 }
      );
    } else if (!isCodeNotExpired) {
      return Response.json(
        {
          success: false,
          message:
            'Verification code has expired. Please sign up again to get a new code.',
        },
        { status: 400 }
      );
    } else {
      return Response.json(
        { success: false, message: 'Incorrect verification code' },
        { status: 400 }
      );
    }
  } catch (error) {
    console.log('Error verifying user:', error);
    console.error('Error verifying user:', error);
    return Response.json(
      { success: false, message: 'Error verifying user' },
      { status: 500 }
    );
  }
}