import { OrderColumn } from "./columns";
import { CheckSquare } from 'lucide-react';

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "react-hot-toast";
import { useParams, useRouter } from "next/navigation";
import { Trash } from "lucide-react";
import axios from "axios";
import AlertModal from "@/components/modals/alert-modal";


interface CellActionProps {
  data: OrderColumn;
}

export const CellAction: React.FC<CellActionProps> = ({ data }) => {
  const { id } = data;
  const [updating, setUpdating] = useState(false);
  const [isPaid, setIsPaid] = useState(data.isPaid);

  const params =  useParams()
  const router = useRouter()
  const [open, setOpen] = useState(false)

  const handleTogglePaid = async () => {
    if (updating) return;

    const newIsPaid = !isPaid;
    setUpdating(true);

    try {
      const response = await fetch(`/api/${params.storeId}/orders/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ isPaid: newIsPaid }),
      });

      if (response.ok) {
        setIsPaid(newIsPaid);
        setUpdating(false);
        toast.success(`Order status updated: ${newIsPaid ? "Paid" : "Unpaid"}`);

        if (newIsPaid) {
          try {
            const emailResponse = await fetch("/api/sendEmail", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                to: data.email,
                subject: "Order Paid",
                text: "The order has been paid.",
              }),
            });
            
            

            if (!emailResponse.ok) {
              console.error("Error sending email:", emailResponse.statusText);
            }
          } catch (emailError) {
            console.error("Error sending email:", emailError);
          }
        }
      } else {
        toast.error("Failed to update order status");
        setUpdating(false);
      }
    } catch (error) {
      toast.error("Failed to update order status");
      console.error("Error updating order status:", error);
      setUpdating(false);
    }
  };



  // Handle delete

  const handleDelete = async () => {
    if (updating) return;

    setUpdating(true);

    try {
      await axios.delete(`/api/${params.storeId}/orders/${id}`);
      router.refresh();
      toast.success('Order deleted.');
    } catch (error) {
      toast.error("Failed to delete order");
      console.error("Error deleting order:", error);
    }finally {
      setUpdating(false);
      setOpen(false);
    }
  }



  // Determine the variant based on the isPaid state
  const variant = isPaid ? "secondary" : "destructive";

  return (
    <>
      <AlertModal 
        isOpen={open}
        onClose={() => setOpen(false)}
        onConfirm={handleDelete}
        loading={updating}
        />
<div className="flex gap-2">
<Button variant={variant} onClick={handleTogglePaid} disabled={updating}>
        {isPaid ? (
          <>
            <CheckSquare color="#12de34" />
            &nbsp; Confirmed
          </>
        ) : (
          <>
         Unconfirmed
          </>
        )}
      </Button>

      <Button variant="destructive" onClick={handleDelete} disabled={updating}>
      <Trash className="mr-2 h-4 w-4"/>
      </Button>
</div>
    </>
  );
};
