const backend_base_url = "http://127.0.0.1:8000"
const frontend_base_url = "http://127.0.0.1:5501"

window.onload = async function loadProfile() {
    console.log("로딩 완료")

    //태그 띄우기
    const response_tag = await fetch('http://127.0.0.1:8000/users/tag/', {
        method : 'GET'
    })
    response_tags = await response_tag.json()

    const tag_list = document.getElementById('tag_list')
    response_tags.forEach(tag => {
        const tag_li = document.createElement('li')
        tag_li.setAttribute("class", "category-item")
        const tag_a = document.createElement('a')
        tag_a.setAttribute("class", "nav-link")
        tag_a.setAttribute("type", "button")
        tag_a.setAttribute("id", tag['name'])
        tag_a.setAttribute("onclick", "handleSearch(this.id)")
        tag_a.innerText = tag['name']
        tag_list.appendChild(tag_li).appendChild(tag_a)
    })

    //게시글 띄우기
    const response_feed = await fetch(`${backend_base_url}` + '/', {
        method:"GET",
    })
    response_feeds = await response_feed.json()
    console.log(response_feeds)

    const feedList = document.getElementById("feed_card")
    response_feeds.forEach(feed => {
        
        // feed 가지고오기
        const newCol = document.createElement("a")
        newCol.setAttribute("class", "feed_card_form")
        newCol.setAttribute("href", `../../feed_detail.html?id=${feed.id}`)
        const newCard = document.createElement("a")
        newCard.setAttribute("type", "button")
        newCard.setAttribute("class", "card")
        newCard.setAttribute("id", feed.id)
        newCol.appendChild(newCard)


        const feedImage = document.createElement("img")
        feedImage.setAttribute("class", "card-img-top")
       
        console.log(feed['image'])
        console.log(`${backend_base_url}${feed['image']}`)
        //video_key 확인
        if(feed['video_key']){
            //video key가 있으면 썸네일 가져와서 넣어주기
            feedImage.setAttribute("src", "https://img.youtube.com/vi/" + `${feed['video_key']}` + "/mqdefault.jpg")
        } else if(feed['image']) {
            //image가 있으면 넣어주기
            feedImage.setAttribute("src", `${backend_base_url}${feed['image']}`)
        }
        newCard.appendChild(feedImage)

        const newCardBody = document.createElement("div")
        newCardBody.setAttribute("class", "card-body")
        newCard.appendChild(newCardBody)

        const newCardTitle = document.createElement("h6")
        newCardTitle.setAttribute("class", "card-title")
        newCardTitle.innerText = feed.title
        newCardBody.appendChild(newCardTitle)

        const newCardName = document.createElement("p")
        newCardName.setAttribute("class", "card-text")
        newCardName.innerText = feed.user
        newCardBody.appendChild(newCardName)

        feedList.appendChild(newCol)
    })
}


//로그아웃
async function handleLogout() {
    console.log("버튼 눌림 / 로그아웃")
    const response = await fetch(`${backend_base_url}/users/logout/`, {
        headers: {
            'content-type': 'application/json',
        },
        method: 'POST',
    })
    localStorage.removeItem("payload")
    localStorage.removeItem("access")
    localStorage.removeItem("refresh")
    location.href = 'login.html';
}

async function handleSearch(tagId) {
    console.log(tagId)

    const response_search_tag = await fetch('http://127.0.0.1:8000/search/?search='+tagId, {
        headers:{
            'Authorization': 'Bearer ' + localStorage.getItem("access"),
            'content-type':'application/json',
        },
        method:'GET',
    })
    response_json_search = await response_search_tag.json()
    console.log(response_json_search)
    
    const feed_card = document.getElementById("feed_card")
    response_json_search.forEach((e) => {
        console.log(e['video_key'])
        const feed_div = document.createElement('div')
        const feed_img = document.createElement('img')
        feed_img.setAttribute("src", "https://img.youtube.com/vi/" + e['video_key'] + "/mqdefault.jpg")
        feed_card.appendChild(feed_div).appendChild(feed_img)
    })
}
