import prismadb from "@/lib/prismadb";
import { SubCategoryClient } from "./components/client";
import { SubCategoryColumn } from "./components/columns";
import { format } from "date-fns"

const CategoriesPage = async ({
    params 
} : {
    params: {
        storeId: string
    }
}) => {
    const categories = await prismadb.subCategory.findMany({
        where: {
            storeId: params.storeId
        },
        include: {
            category: true,

        },
        orderBy: {
            createdAt: 'desc'
        }
    })

    const formattedCategories: SubCategoryColumn[] = categories.map((item) => ({
        id: item.id,
        name: item.name,
        categoryName: item.category.name,
        createdAt: format(item.createdAt, "MMMM do, yyyy")
    }))
    return ( 
        <div className="flex-col">
            <div className="flex-1 space-y-4 p-8 pt-6">
                <SubCategoryClient  data={formattedCategories}/>
            </div>
        </div>
     );
}
 
export default CategoriesPage;