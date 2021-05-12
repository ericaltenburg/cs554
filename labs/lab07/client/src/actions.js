const setPage = (pageTerm, pageData) => ({
    type: 'SET_PAGE',
    payload: {pageTerm: pageTerm, pageData: pageData}
});

module.exports = {
    setPage
};