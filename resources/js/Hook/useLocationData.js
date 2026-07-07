import React, { useEffect, useState } from "react";
import axios from "axios";
import { showAlert } from "../Utils/swal";

export function useLocationData(initialCountry = "") {
    const [allData, setAllData] = useState([]);
    const [availableStates, setAvailableStates] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        axios
            .get("https://countriesnow.space/api/v0.1/countries/states")
            .then((res) => {
                setAllData(res.data.data);
                setLoading(false);

                if (initialCountry) {
                    const selected = res.data.data.find(
                        (c) => c.name === initialCountry,
                    );
                    setAvailableStates(selected ? selected.states : []);
                }
            })
            .catch((err) => {
                showAlert(
                    "Failed to Load Region",
                    "Country and province data cannot be accessed. Check your internet connection.",
                    "error",
                ).then((result) => {
                    if (result.isConfirmed || result.dismiss) {
                        window.history.back();
                    }
                });
                setLoading(false);
            });
    }, []);

    const updateAvailableStates = (countryName) => {
        const selected = allData.find((c) => c.name === countryName);
        setAvailableStates(selected ? selected.states : []);
    };

    return { allData, availableStates, loading, updateAvailableStates };
}
