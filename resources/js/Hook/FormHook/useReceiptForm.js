import { useForm } from "@inertiajs/react";

export default function useReceiptForm(bean_id) {
    const { data, setData, transform, post, processing, errors } = useForm({
        quantity: "",
        price_per_kg: "",
        received_at: new Date().toISOString().split("T")[0],
        supplier_id: "",
        reference: "",
        note: "",
    });

    const submit = (e) => {
        e.preventDefault();

        transform((data) => ({
            ...data,
            bean_id: bean_id,
        }));

        post(route("receipt.store"));
    };

    return { data, setData, processing, errors, submit };
}
