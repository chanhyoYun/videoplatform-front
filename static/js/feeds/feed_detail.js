const backend_base_url = "http://127.0.0.1:8000"
const frontend_base_url = "http://127.0.0.1:5501"

window.onload = async function getFeedDetail(){
    console.log("콘솔 불러오기")
    
    // 태그 띄우기
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

// http://127.0.0.1:5501/feed_detail.html?id=4

    const urlParams = new URL(location.href).searchParams;
    const feed_id = urlParams.get('id');

    const response = await fetch(`${backend_base_url}`+ '/' + feed_id + '/', {
        method : 'GET'
    })
    response_json = await response.json()
    console.log(response_json)    

    // 본문 내용
    const title = document.getElementById('title')
    const context = document.getElementById('context')
    const createdDate = document.getElementById('created_date')
    const updatedDate = document.getElementById('updated_date')
    const commentCount = document.getElementById('comments_count')
    const likeCount = document.getElementById('like_count')
    const hitCount = document.getElementById('hit_count')
    // const feedImage = document.getElementById('image')
    
    title.innerText = response_json['title']
    context.innerText = response_json['context']
    createdDate.innerText = new Date().toString(response_json['created_date']) + " 작성"
    updatedDate.innerText = new Date().toString(response_json['updated_date']) + " 수정"
    console.log(response_json['likes_count'])

    // user 정보, channel정보 받아와야함(백엔드 구현)
    const username = document.getElementById('user')
    username.innerText = response_json['user']

    //key값에 video_key가 들어왔는지 확인
    console.log(response_json['video_key'])
    if(response_json['video_key']){
        //video 보기, video-box 위치에 입력
        const videoBox = document.getElementById('video-box');
        const feedVideo = document.createElement('iframe')
        feedVideo.setAttribute('class', 'videocard')
        // Use local file
        // video.src = 'video.mp4';

        // Use remote file
        feedVideo.setAttribute("src", 'https://www.youtube.com/embed/' + `${response_json['video_key']}`)
        
        videoBox.appendChild(feedVideo);
        
    }
    //image는 무조건 있는데, default_image인지 확인
    else{
        console.log(response_json['image'])
        const imageBox = document.getElementById('image-box');
        const feedImage = document.createElement("img")
        feedImage.setAttribute('class', 'imagecard')
        feedImage.setAttribute("src", `${backend_base_url}` + `${response_json['image']}`)
        imageBox.appendChild(feedImage)

    }
    likeCount.innerText = response_json['likes_count']
    hitCount.innerText = response_json['hits']


    
    

    // 댓글 불러오기
    commentCount.innerText = response_json['comments_count']
    console.log(feed_id)
    const response_comment = await fetch(`${backend_base_url}/comments/${feed_id}`, {
        headers:{
            'Authorization': 'Bearer ' + localStorage.getItem("access"),
        },
        method:"GET"
    })
    const response_json_comment = await response_comment.json()

    const feed_comments = document.getElementById("feed_comments")
    response_json_comment.forEach(comment => {
        console.log(comment['user'])
        const comment_div = document.createElement('div')
        comment_div.setAttribute("class", "comment-div-form")
        const comment_user = document.createElement('p')
        comment_user.innerText = comment['user']
        comment_div.appendChild(comment_user)

        const comment_text = document.createElement('p')
        comment_text.innerText = comment['text']
        comment_div.appendChild(comment_text)
        feed_comments.appendChild(comment_div)
    })
}

async function inputComment() {
    const urlFeed = new URL(location.href).searchParams;
    const feedId = urlFeed.get('id')

    const comment_text = document.getElementById('comment-text').value
    const response_input = await fetch(`${backend_base_url}/comments/${feedId}/`, {
        headers:{
            'Authorization': 'Bearer ' + localStorage.getItem("access"),
            'content-type':'application/json',
        },
        method:"POST",
        body: JSON.stringify({
            "text":comment_text,
        })
    })
    console.log(response_input)
    location.reload()
}

