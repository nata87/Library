document.getElementById("logout").addEventListener("click",function(){
    sessionStorage.clear();
    window.location.href="index.html"
})

//Search container
document.addEventListener("DOMContentLoaded", function () {
    const searchBtn = document.getElementById("create-btn");
    const searchForm = document.getElementById("create-form");

    searchBtn.addEventListener("click", function (event) {
        event.preventDefault(); // Evita il refresh della pagina
        searchForm.style.display = searchForm.style.display === "block" ? "none" : "block";
    });
});

