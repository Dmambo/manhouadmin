import prismadb from "@/lib/prismadb";
import { SubCategoryForm } from "./components/Subcategory-form";


const SubCategoryPage = async ({
    params 
} : {
    params: {
        subcategoryId: string
        storeId: string
    }
}) => {

    const category = await prismadb.subCategory.findUnique({
        where: {
            id: params.subcategoryId
        }
    })

    const billboards = await prismadb.category.findMany({
        where: {
            storeId: params.storeId
        }
    })
    return ( <div className="flex-col">
        <div className="flex-1 space-y-4 p-8 pt-6">
            <SubCategoryForm
            categories={billboards} 
            initialData={category}/>
        </div>

    </div> );
}
 
export default SubCategoryPage;