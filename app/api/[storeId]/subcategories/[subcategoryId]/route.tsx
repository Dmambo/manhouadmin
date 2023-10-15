import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs";

import prismadb from "@/lib/prismadb";

export async function GET(
  req: Request,
  { params }: { params: { subcategoryId: string } }
) {
  try {
    if (!params.subcategoryId) {
      return new NextResponse("Billboard id is required", { status: 400 });
    }

    const category = await prismadb.subCategory.findUnique({
      where: {
        id: params.subcategoryId
      },
      include: { category: true}
    });
  
    return NextResponse.json(category);
  } catch (error) {
    console.log('[SUB_CATEGORY_GET]', error);
    return new NextResponse("Internal error", { status: 500 });
  }
};

export async function DELETE(
  req: Request,
  { params }: { params: { subcategoryId: string, storeId: string } }
) {
  try {
    const { userId } = auth();

    if (!userId) {
      return new NextResponse("Unauthenticated", { status: 403 });
    }

    if (!params.subcategoryId) {
      return new NextResponse("SubCategory id is required", { status: 400 });
    }

    const storeByUserId = await prismadb.store.findFirst({
      where: {
        id: params.storeId,
        userId,
      }
    });

    if (!storeByUserId) {
      return new NextResponse("Unauthorized", { status: 405 });
    }

    const category = await prismadb.subCategory.deleteMany({
      where: {
        id: params.subcategoryId,
      }
    });
  
    return NextResponse.json(category);
  } catch (error) {
    console.log('[SUB_CATEGORY_DELETE]', error);
    return new NextResponse("Internal error", { status: 500 });
  }
};


export async function PATCH(
  req: Request,
  { params }: { params: { subcategoryId: string, storeId: string } }
) {
  try {   
    const { userId } = auth();

    const body = await req.json();
    
    const { name, categoryId } = body;
    
    if (!userId) {
      return new NextResponse("Unauthenticated", { status: 403 });
    }

    if (!name) {
      return new NextResponse("Label is required", { status: 400 });
    }

    if (!categoryId) {
      return new NextResponse("Category id is required", { status: 400 });
    }

    if (!params.subcategoryId) {
      return new NextResponse("SubCategory id is required", { status: 400 });
    }

    const storeByUserId = await prismadb.store.findFirst({
      where: {
        id: params.storeId,
        userId,
      }
    });

    if (!storeByUserId) {
      return new NextResponse("Unauthorized", { status: 405 });
    }

    const category = await prismadb.subCategory.updateMany({
      where: {
        id: params.subcategoryId,
      },
      data: {
        name,
        categoryId
      }
    });
  
    return NextResponse.json(category);
  } catch (error) {
    console.log('[CATEGORY_PATCH]', error);
    return new NextResponse("Internal error", { status: 500 });
  }
};


