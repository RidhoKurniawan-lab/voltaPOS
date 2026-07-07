export function usePagination(dataPaginate) {
    const currentPage = dataPaginate.current_page;
    const perPage = dataPaginate.per_page;
    const total = dataPaginate.total;

    // range
    const from = (currentPage - 1) * perPage + 1;
    const to = Math.min(currentPage * perPage, total);

    // change default Previous & Next
    const getLabel = (label) => {
        if (label === "&laquo; Previous") return "<";
        if (label === "Next &raquo;") return ">";
        return label;
    };

    // isNumber
    const isNumberPage = (label) => !isNaN(Number(label));

    const getVisibleLinks = () => {
        return dataPaginate.links.filter((link, index) => {
            const pageNum = Number(link.label);

            const isFirstOrlast = index === 0 || index === dataPaginate.links.length - 1;

            const isWithInRange =
                isNumberPage(link.label) &&
                pageNum >= currentPage - 2 &&
                pageNum <= currentPage + 2;

            return isFirstOrlast || isWithInRange;
        });
    };

    return {
        from,
        to,
        getLabel,
        getVisibleLinks,
        currentPage,
        total
    };
}
