// alert("script file works!");

let authorLinks = document.querySelectorAll("a");
for(authorLink of authorLinks){
    authorLink.addEventListener("click", getAuthorInfo);
}

// adding class
let buttons = document.querySelectorAll("button");
for (let btn of buttons) {
    btn.classList.add("btn", "btn-light",);
}

async function getAuthorInfo(){

    const myModal = new bootstrap.Modal(document.getElementById('authorModal'));
    myModal.show();

    // alert(this.id);
    let url = `/api/author/${this.id}`;
    let respones = await fetch(url);
    let data = await respones.json();
    // console.log(data);

    let authorInfo = document.querySelector("#authorInfo");
    authorInfo.innerHTML = `<h1>
                                ${data[0].firstName}
                                ${data[0].lastName}
                            </h1>`;
    authorInfo.innerHTML += `<img 
                                    src = "${data[0].portrait}"
                                    width = "200"
                            
                            ><br>`;

    authorInfo.innerHTML += `
        <p>Date of birth: ${new Date(data[0].dob).toLocaleDateString()}</p>
        <p>Date of death: ${new Date(data[0].dod).toLocaleDateString()}</p>
        <p>Sex: ${data[0].sex}</p>
        <p>Profession: ${data[0].profession}</p>
        <p>Country: ${data[0].country}</p>
        <p>${data[0].biography}</p>
    `;

}