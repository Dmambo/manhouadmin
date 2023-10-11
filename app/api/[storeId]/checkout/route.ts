import { NextResponse } from "next/server";
import { prismadb } from "@/lib/prismadb";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, GET, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders });
}

export async function POST(
  req: Request,
  { params }: { params: { storeId: string } }
) {
  try {
    const requestBody = await req.text();
    console.log("Received Request Body:", requestBody);

    let requestData;
    try {
      requestData = JSON.parse(requestBody);
      console.log("Parsed Request Data:", requestData);
    } catch (error) {
      console.error("Error parsing JSON data:", error);
      return new NextResponse("Invalid JSON data", { status: 400 });
    }

    const {
      name,
      address,
      phone,
      email,
      transactionId,
      products,
      quantities,
    } = requestData;

    if (
      !name ||
      !address ||
      !phone ||
      !email ||
      !transactionId ||
      !products ||
      !quantities ||
      products.length !== quantities.length
    ) {
      return new NextResponse("Missing or invalid required fields", {
        status: 400,
      });
    }

    const orderItems = products.map((productId: string, index: number) => ({
      product: {
        connect: {
          id: productId,
        },
      },
      quantity: quantities[index] || 1,
    }));

    const order = await prismadb.order.create({
      data: {
        storeId: params.storeId,
        isPaid: false,
        transactionId,
        name,
        phone,
        address,
        email,
        orderItems: {
          create: orderItems,
        },
      },
    });

    // Perform any additional logic or payment processing here

    return NextResponse.json({ orderId: order.id }, { headers: corsHeaders });
  } catch (error) {
    console.error("Error processing payment:", error);
    return new NextResponse("Something went wrong.", { status: 500 });
  }
}
