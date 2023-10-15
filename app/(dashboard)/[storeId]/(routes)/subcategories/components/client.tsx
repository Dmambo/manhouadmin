"use client"

import Heading from "@/components/ui/Heading"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Plus } from "lucide-react"
import { useParams, useRouter } from "next/navigation"
import { SubCategoryColumn, columns } from "./columns"
import { DataTable } from "@/components/ui/data-table"
import { ApiList } from "@/components/ui/api-list"


interface SubCategoryClientProps {
    data: SubCategoryColumn[]
}

export const SubCategoryClient: React.FC<SubCategoryClientProps> = ({
    data
}) => {

    const router = useRouter()
    const params = useParams()


    return (
       <>
        <div className="flex items-center justify-between">
            <Heading title={`SubCategories (${data.length})`}
            description="Manage subcategories for your store"
            />
            <Button onClick={()=> router.push(`/${params.storeId}/subcategories/new`)}>
                <Plus className="mr-2 h-4 w-4" />
                Add new
            </Button>
        </div>
        <Separator />
        <DataTable searchKey="name" columns={columns} data={data}/>
        <Heading 
        title="API"
        description="Use this API to display your Subcategories in your app"
        />
        <Separator />
        <ApiList entityName="subcategories" entityIdName="subcategoryId" />
        </>
    )
}