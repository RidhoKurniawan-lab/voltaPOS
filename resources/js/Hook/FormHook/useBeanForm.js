import { useForm } from "@inertiajs/react";
import { useLocationData } from "../useLocationData";
import { route } from "ziggy-js";
import React from "react";

export function useBeanForm(initialData = {}) {
    const currentYear = new Date().getFullYear();

    const { data, setData, post, put, processing, errors } = useForm({
        name: initialData.name || "",
        origin_country: initialData.origin_country|| "Indonesia",
        origin_region: initialData.origin_region || "",
        sub_origin: initialData.sub_origin || "",
        species: initialData.species || "",
        variety: initialData.variety || "",
        processing_method: initialData.processing_method || "",
        grade: initialData.grade || "",
        altitude_min: initialData.altitude_min || "",
        altitude_max: initialData.altitude_max || "",
        crop_year: initialData.crop_year || currentYear,
        price_per_kg: initialData.price_per_kg || "",
        ...initialData,
    });

    const { allData, availableStates, loading, updateAvailableStates } =
        useLocationData(data.origin_country);

    const handleCountryChange = (e) => {
        const country = e.target.value;
        setData({
            ...data,
            origin_country: country,
            origin_region: "",
        });
        updateAvailableStates(country);
    };

    const submit = (e, id = null) => {
        e.preventDefault();
        if (id) {
            put(route("beans.update", id));
        }else{
            post(route("beans.store"));
        }
    };

    return {
        formData: { data, setData, errors, processing, submit },
        locationData: { allData, availableStates, loading, handleCountryChange },
        helpers: { currentYear },
    };
};
