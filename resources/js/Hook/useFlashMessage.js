import { usePage } from "@inertiajs/react";
import { useEffect, useRef } from "react";
import { showToast } from "@/Utils/swal";

export default function useFlashMessages() {
    const { flash, success } = usePage().props;
    const lastDisplayedTimestamp = useRef(null);

    useEffect(() => {
        const message = flash?.success || success;
        const currentTimestamp = flash?.timestamp;

        if (message && currentTimestamp !== lastDisplayedTimestamp.current) {

            const timer = setTimeout(() => {
                showToast(message, "success");

                lastDisplayedTimestamp.current = currentTimestamp;
            }, 300);

            return () => clearTimeout(timer);
        }
    }, [flash, success]);

    return null;
}
