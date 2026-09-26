import { prisma } from "./db";
import { verifyToken } from "./services/auth.service";

export type GraphQLContext = {
  prisma: typeof prisma;
  user: { id: string } | null;
};

export const buildContext = async ({
  request,
}: {
  request: Request;
}): Promise<GraphQLContext> => {
  const authHeader = request.headers.get("authorization");

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return { prisma, user: null };
  }

  try {
    const token = authHeader.replace("Bearer ", "");
    const payload = verifyToken(token);

    const user = await prisma.user.findUnique({
      where: { id: payload.userId },
      select: { id: true },
    });

    return { prisma, user: user ? { id: user.id } : null };
  } catch {
    return { prisma, user: null };
  }
};
