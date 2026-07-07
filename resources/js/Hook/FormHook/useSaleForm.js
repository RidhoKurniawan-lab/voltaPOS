import { useForm, router } from "@inertiajs/react";
import { route } from "ziggy-js";
import { useEffect, useRef, useCallback } from "react";
import { showConfirm } from "@/Utils/swal";

export default function useSaleForm(invoiceNumber = "") {
    const {
        data,
        setData,
        post,
        processing,
        errors,
        reset,
        setError,
        clearErrors,
    } = useForm({
        invoice_number: invoiceNumber,
        items: [{ product_id: "", quantity: "", price: "", subtotal: 0 }],
        money_received: "",
    });

    const isDirty = useRef(false);

    useEffect(() => {
        const hasData =
            data.items.some((i) => i.product_id || i.quantity || i.price) ||
            data.money_received;
        isDirty.current = hasData;
    }, [data]);

    useEffect(() => {
        const handleBeforeUnload = (e) => {
            if (isDirty.current) {
                e.preventDefault();
                e.returnValue = "";
            }
        };

        window.addEventListener("beforeunload", handleBeforeUnload);

        const removeListener = router.on("before", (event) => {
            if (isDirty.current && !processing) {
                event.preventDefault();

                showConfirm(
                    "Konfirmasi Meninggalkan Halaman",
                    "Anda memiliki keranjang belanja yang belum disimpan. Yakin ingin meninggalkan halaman ini?",
                    "Ya, Tinggalkan",
                ).then((result) => {
                    if (result.isConfirmed) {
                        isDirty.current = false;
                        router.visit(
                            event.detail.visit.url,
                            event.detail.visit,
                        );
                    }
                });
            }
        });

        return () => {
            window.removeEventListener("beforeunload", handleBeforeUnload);
            removeListener();
        };
    }, [processing]);

    const updateItem = useCallback(
        (index, field, value) => {
            const newItems = [...data.items];
            if (typeof field === "object" && field !== null) {
                newItems[index] = { ...newItems[index], ...field };
            } else {
                newItems[index] = { ...newItems[index], [field]: value };
            }

            const qty = parseFloat(newItems[index].quantity) || 0;
            const price = parseFloat(newItems[index].price) || 0;
            newItems[index].subtotal = qty * price;

            setData("items", newItems);
        },
        [data.items, setData],
    );

    const addItem = useCallback(() => {
        setData("items", [
            ...data.items,
            { product_id: "", quantity: "", price: "", subtotal: 0 },
        ]);
    }, [data.items, setData]);

    const removeItem = useCallback(
        (index) => {
            if (data.items.length <= 1) return;
            const newItems = data.items.filter((_, i) => i !== index);
            setData("items", newItems);
        },
        [data.items, setData],
    );

    const grandTotal = data.items.reduce(
        (sum, item) => sum + (item.subtotal || 0),
        0,
    );

    const moneyChange = (parseFloat(data.money_received) || 0) - grandTotal;

    const validate = useCallback(() => {
        const validationErrors = {};

        if (data.items.length === 0) {
            validationErrors.items = "Minimal harus ada 1 item produk.";
        }

        data.items.forEach((item, index) => {
            if (!item.product_id) {
                validationErrors[`items.${index}.product_id`] =
                    "Produk wajib dipilih.";
            }
            if (!item.quantity || parseFloat(item.quantity) <= 0) {
                validationErrors[`items.${index}.quantity`] =
                    "Jumlah harus lebih dari 0.";
            }
            if (!item.price || parseFloat(item.price) <= 0) {
                validationErrors[`items.${index}.price`] =
                    "Harga harus lebih dari 0.";
            }
        });

        if (!data.money_received || parseFloat(data.money_received) <= 0) {
            validationErrors.money_received = "Uang diterima wajib diisi.";
        } else if (parseFloat(data.money_received) < grandTotal) {
            validationErrors.money_received =
                "Uang diterima tidak boleh kurang dari total harga.";
        }

        return validationErrors;
    }, [data, grandTotal]);

    const submit = useCallback(
        (e) => {
            e.preventDefault();

            clearErrors();
            const validationErrors = validate();

            if (Object.keys(validationErrors).length > 0) {
                Object.entries(validationErrors).forEach(([key, message]) => {
                    setError(key, message);
                });
                return;
            }

            showConfirm(
                "Simpan Transaksi?",
                `Yakin ingin menyimpan transaksi ini dengan total ${new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(grandTotal)}?`,
                "Ya, Simpan",
            ).then((result) => {
                if (!result.isConfirmed) {
                    return;
                }

                isDirty.current = false;
                post(route("sales.store"), {
                    onSuccess: () => {
                        // Flash data will be available in page.props.flash
                    },
                });
            });
        },
        [validate, post, clearErrors, setError],
    );

    return {
        data,
        setData,
        processing,
        errors,
        reset,
        updateItem,
        addItem,
        removeItem,
        grandTotal,
        moneyChange,
        submit,
    };
}
