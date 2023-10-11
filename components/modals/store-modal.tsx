"use client";
import * as z from 'zod'

import { useStoreModal } from "@/hooks/use-store-modal";
import { Modal } from "@/components/ui/modal"
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import axios from 'axios';
import { useState } from 'react';
import { toast } from 'react-hot-toast';


const formSchema = z.object({
    name: z.string().min(1)
})

export const StoreModal = () => {
    const storeModal = useStoreModal();

    const [loading, setLoading] = useState(false)

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: ''
        }
    })

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
     try{
        setLoading(true)

        const response = await axios.post('/api/stores', values);

        window.location.assign(`/${response.data.id}`);
     }
     catch (error) {
        toast.error("Something went wrong.")
     }
     finally {
        setLoading(false)
     }
    }

    return ( 
   <Modal
    title="create store"
    description="Add a new store to manage products"
    isOpen={storeModal.isOpen}
    onClose={storeModal.onClose}
    >
        <div>
            <div className='py-2 pb-4 space-y-4'>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)}>
                       <FormField
                       control={form.control}
                       name='name'
                       render={({ field }) => (
                        <FormItem>
                            <FormLabel>name</FormLabel>
                            <FormControl>
                                <Input 
                                disabled={loading}
                                placeholder='e-commerce'
                                {...field}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                       )}
                       />
                         <div className='pt-6 space-x-2 flex items-center justify-end w-full'>
                            <Button
                            disabled={loading}
                            variant='outline'
                            onClick={storeModal.onClose}
                            >
                                cancel
                            </Button>
                            <Button 
                            disabled={loading}
                            type='submit'>
                                continue
                            </Button>
                         </div>
                    </form>
                </Form>
            </div>
        </div>
    </Modal>
    )
}