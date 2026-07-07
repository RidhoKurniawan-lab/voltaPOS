import { router } from "@inertiajs/react";
import { debounce } from "lodash";
import { useCallback, useState } from "react";
import { route } from "ziggy-js";

export function useSearch(initialFilter, categories, url) {
    const [filters, setFilters] = useState({
        search: initialFilter?.search || "",
        category: initialFilter?.category || "",
        minStock: initialFilter?.minStock || "",
    });

    const applySearch = useCallback(
        debounce((newFilters) => {
            router.get(route(url), newFilters, {
                preserveState: true,
                replace: true,
                only: ["products"],
            });
        }, 500),
        [],
    );

    const applyFilter = (newFilters) => {
        router.get(route(url), newFilters, {
            preserveState: true,
            replace: true,
            only: ["products"],
        });
    };

    const updateFilter = (key, value, isSearch = false) => {
        const newFilters = { ...filters, [key]: value };
        setFilters(newFilters);

        if (isSearch) {
            applySearch(newFilters);
        } else {
            applyFilter(newFilters);
        }
    };

    const handleSearchChange = (e) =>
        updateFilter("search", e.target.value, true);
    const handleCategoryChange = (e) =>
        updateFilter("category", e.target.value);
    const handleMinStockChange = (e) =>
        updateFilter("minStock", e.target.value);

    const activeFilter = Object.keys(filters)
        .filter((key) => filters[key])
        .map((key) => {
            let label = filters[key];
            if (key === "minStock") {
                label = `Stok < ${filters[key]}`;
            } else if (key === "category") {
                categories.map((category) => {
                    if (category.id == filters[key]) {
                        label = `Kategori: ${category.name}`;
                    }
                })
            }
            return { key, label };
        });

    const removeFilter = (key) => {
        updateFilter(key, "");
    };

    const clearAllFilters = () => {
        const resetFilter = { search: "", category: "", minStock: "" };
        setFilters(resetFilter);
        applySearch(resetFilter);
    };

    return {
        ...filters,
        activeFilter,
        clearAllFilters,
        removeFilter,
        handleSearchChange,
        handleCategoryChange,
        handleMinStockChange,
    };
}
