import { useForm, router } from "@inertiajs/react";
import { route } from "ziggy-js";
import { useEffect, useRef, useCallback } from "react";
import { showConfirm, showAlert } from "@/Utils/swal";

export default function usePurchaseForm(initialData = null) {
    const { data, setData, post, put, processing, errors, reset } = useForm({
        supplier_id: initialData?.supplier_id || "",
        invoice_number: initialData?.invoice_number || "",
        date: initialData?.created_at
            ? new Date(initialData.created_at).toISOString().split("T")[0]
            : new Date().toISOString().split("T")[0],
        items: initialData?.details
            ? initialData.details.map((d) => ({
                  product_id: d.product_id,
                  quantity: parseFloat(d.quantity) || "",
                  price: parseFloat(d.price) || "",
                  subtotal:
                      (parseFloat(d.quantity) || 0) *
                      (parseFloat(d.price) || 0),
              }))
            : [{ product_id: "", quantity: "", price: "", subtotal: 0 }],
    });

    const isDirty = useRef(false);

    // Track apakah form sudah diisi (dirty state)
    useEffect(() => {
        const hasData =
            data.supplier_id ||
            data.invoice_number ||
            data.items.some((i) => i.product_id || i.quantity || i.price);
        isDirty.current = hasData;
    }, [data]);

    // Warning ketika user meninggalkan halaman dengan data belum disimpan
    useEffect(() => {
        const handleBeforeUnload = (e) => {
            if (isDirty.current) {
                e.preventDefault();
                e.returnValue = "";
            }
        };

        window.addEventListener("beforeunload", handleBeforeUnload);

        // Inertia before navigation guard
        const removeListener = router.on("before", (event) => {
            if (isDirty.current && !processing) {
                event.preventDefault();

                showConfirm(
                    "Konfirmasi Meninggalkan Halaman",
                    "Anda memiliki data yang belum disimpan. Yakin ingin meninggalkan halaman ini?",
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

    // Update item di baris tertentu
    const updateItem = useCallback(
        (index, field, value) => {
            const newItems = [...data.items];
            if (typeof field === "object" && field !== null) {
                newItems[index] = { ...newItems[index], ...field };
            } else {
                newItems[index] = { ...newItems[index], [field]: value };
            }

            // Auto-calculate subtotal
            const qty = parseFloat(newItems[index].quantity) || 0;
            const price = parseFloat(newItems[index].price) || 0;
            newItems[index].subtotal = qty * price;

            setData("items", newItems);
        },
        [data.items, setData],
    );

    // Tambah baris baru
    const addItem = useCallback(() => {
        setData("items", [
            ...data.items,
            { product_id: "", quantity: "", price: "", subtotal: 0 },
        ]);
    }, [data.items, setData]);

    // Hapus baris
    const removeItem = useCallback(
        (index) => {
            if (data.items.length <= 1) return;
            const newItems = data.items.filter((_, i) => i !== index);
            setData("items", newItems);
        },
        [data.items, setData],
    );

    // Hitung grand total
    const grandTotal = data.items.reduce(
        (sum, item) => sum + (item.subtotal || 0),
        0,
    );

    // Frontend validation
    const validate = useCallback(() => {
        const validationErrors = {};

        if (!data.supplier_id) {
            validationErrors.supplier_id = "Supplier wajib dipilih.";
        }
        if (!data.invoice_number.trim()) {
            validationErrors.invoice_number = "Nomor invoice wajib diisi.";
        }
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

        return validationErrors;
    }, [data]);

    // Submit handler
    const submit = useCallback(
        (e) => {
            e.preventDefault();

            const validationErrors = validate();
            if (Object.keys(validationErrors).length > 0) {
                const firstError = Object.values(validationErrors)[0];
                showAlert("Validasi Gagal", firstError, "error");
                return;
            }

            isDirty.current = false;
            const confirmationText = initialData?.id
                ? `Apakah yakin ingin save perubahan transaksi pembelian ini dengan total ${new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(grandTotal)}?`
                : `Apakah yakin ingin save transaksi pembelian ini dengan total ${new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(grandTotal)}?`;

            showConfirm(
                initialData?.id
                    ? "Simpan Perubahan Pembelian?"
                    : "Simpan Transaksi Pembelian?",
                confirmationText,
                "Ya, Save",
            ).then((result) => {
                if (!result.isConfirmed) {
                    return;
                }

                isDirty.current = false;
                if (initialData?.id) {
                    put(route("purchases.update", initialData.id));
                } else {
                    post(route("purchases.store"));
                }
            });
        },
        [validate, post, put, initialData, grandTotal],
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
        submit,
    };
}
