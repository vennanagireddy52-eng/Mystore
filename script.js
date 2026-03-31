const urlParams = new URLSearchParams(window.location.search);
const sharedCategory = urlParams.get('cat');

if (sharedCategory) {
    // Logic to filter your products array by 'sharedCategory'
    const filtered = products.filter(p => p.cat === sharedCategory);
    displayProducts(filtered); 
}
