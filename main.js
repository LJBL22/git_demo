//常數與變數
const BASE_URL = 'https://movie-list.alphacamp.io'
const INDEX_URL = BASE_URL + '/api/v1/movies/' // + ID
const POSTER_URL = BASE_URL + '/posters/' // + img
const MOVIES_PER_PAGE = 12

const movies = []
let filteredMovies = []
let pageNumber = 1

const dataPanel = document.querySelector('#data-panel')
const searchForm = document.querySelector('#search-form')
const searchInput = document.querySelector('#search-input')
const controlRenderStyle = document.querySelector('#control-render-style')
const paginator = document.querySelector('#paginator')

//main code
renderMovieList()

//監聽
dataPanel.addEventListener('click', onPanelClick)
searchForm.addEventListener('submit', onSearchFormSubmitted)
controlRenderStyle.addEventListener('click', changeStyle)
controlRenderStyle.addEventListener('click', goToPage)
paginator.addEventListener('click', changeStyle)
paginator.addEventListener('click', goToPage)

//函式 依照畫面從上往下、及關聯性羅列
function renderMovieList() {
  axios.get(INDEX_URL)
    .then((response) => {
      //寫法一：for...of //利用展開運算子，展開 r.d.r ... 裡的元素，接著 push 近 movies 陣列
      if (movies.length === 0) { //初始為空陣列 利用長度來判斷較不容易出錯
        movies.push(...response.data.results)
        renderPaginator(movies.length) //先 renderPage 才做 renderCardList 
        renderCardStyle(getMoviesByPage(1)) //初始值是第一頁
      } else {
        console.log('有東西就可以執行其他');
      }
    })
    .catch(error => console.log(error))
}
function renderCardStyle(data) {
  let HTMLContent = ''
  data.forEach(item => {
    HTMLContent += `
      <div class="col">
        <div class="card">
          <img
            src="${POSTER_URL + item.image}"
            class="card-img-top" alt="Movie Poster">
          <div class="card-body">
            <h5 class="card-title">${item.title}</h5>
          </div>
          <div class="card-footer">
            <button type="button" class="btn btn-primary btn-show-movie" data-bs-toggle="modal"
              data-bs-target="#movie-modal" data-id="${item.id}">More</button>
            <button type="button" class="btn btn-info btn-add-favourite" data-id="${item.id}">♡</button>
          </div>
        </div>
      </div>
    `
  })
  dataPanel.innerHTML = HTMLContent
}
function renderTableStyle(data) {
  let HTMLContent = `
    <table class="table table-hover align-middle">
      <tbody>`
  data.forEach(item => {
    HTMLContent += `
        <tr>
          <th scope="row">
          <img src="${POSTER_URL + item.image}" width="50" alt="Movie Poster">
          </th>
          <td>${item.title}</td>
          <td><button type="button" class="btn btn-primary btn-sm btn-show-movie" data-bs-toggle="modal" data-bs-target="#movie-modal" data-id="${item.id}">More</button></td>
          <td><button type="button" class="btn btn-success btn-sm btn-add-favourite" data-id="${item.id}">♡</button></td>
        </tr>
    `
  })
  HTMLContent += `
      </tbody>
    </table>`
  dataPanel.innerHTML = HTMLContent
}
function changeStyle(event) {
  console.log(event);
  if (event.target.matches('.show-card-btn')) {
    renderPaginator(movies.length)
    renderCardStyle(getMoviesByPage(1))
    // console.log('success');
  } else if (event.target.matches('.show-table-btn')) {
    renderPaginator(movies.length)
    renderTableStyle(getMoviesByPage(1))
  }
}
function getMoviesByPage(page) {
  // page 1 = 0-11 //splice(0,12)
  // page 2 = 12-23 //splice(12,24)
  // ...> 因為 slice 結尾的 index 不會被包含

  //注意，這裡的 movies 有兩個可能性，可用 三元運算子來做判斷

  // 寫法一
  // let data = movies
  // if (filteredMovies.length) {
  //   data = filteredMovies
  // }
  //寫法二 三元運算子 條件 ? true 回傳值: false 回傳值  
  const data = filteredMovies.length ? filteredMovies : movies
  const startIndex = (page - 1) * MOVIES_PER_PAGE
  return data.slice(startIndex, startIndex + MOVIES_PER_PAGE) //回傳此值讓其他函式繼續利用 //在函式外用其他變數接住這個回傳值做後續操作，
}
function goToPage(event) {
  console.log(pageNumber)
  if (event.target.tagName !== 'A' || event.target.tagName !== 'I') return // 錯誤處理 i.e 我們只要 tagName = A 或 I 的時候才執行此函式；否則跳出結束

  pageNumber = Number(event.target.dataset.page)
  console.log(pageNumber);
  renderCardStyle(getMoviesByPage(pageNumber))
}
function onSearchFormSubmitted(event) {
  //取消預設事件，避免頁面重新跳轉 //該預設事件是綁在 form 上面的 action
  event.preventDefault()
  //取得搜尋關鍵字 
  const keyword = searchInput.value.trim().toLowerCase()
  //條件篩選
  //作法二  filter() 以及 includes() 會有大小寫之分，因此再加上 toLowerCase
  filteredMovies = movies.filter(movie => {
    return movie.title.toLowerCase().includes(keyword)
  })
  //若要大括號的話，在這個情境就一定要寫 Return 
  //這邊只有一行的話可以省略花括號，以及 Return 

  //錯誤處理：無符合條件則跳通知提醒
  if (filteredMovies.length === 0) {
    return alert('查無關鍵字，請重新輸入！')
  }
  renderPaginator(filteredMovies.length)
  renderCardStyle(getMoviesByPage(1))
}

function renderPaginator(amount) {
  //80 = 12 * 6...8
  const totalPages = Math.ceil(amount / MOVIES_PER_PAGE)
  let HTMLContent = ''
  for (let page = 1; page <= totalPages; page++) { //這裡不寫 i ，直接語意化命名 page
    HTMLContent += `<li class="page-item"><a class="page-link" href="#" data-page="${page}">${page}</a></li>` //新增 data-* 屬性是關鍵，方便未來取
  }
  paginator.innerHTML = HTMLContent
}

function onPanelClick(event) {
  if (event.target.matches('.btn-show-movie')) {
    // console.log(event.event.target.dataset)
    showMovieModal(event.target.dataset.id)
  } else if (event.target.matches('.btn-add-favourite')) {
    addToFavourite(Number(event.target.dataset.id))
  }
}
function showMovieModal(id) {
  const modalTitle = document.querySelector('#movie-modal-title')
  const modalImage = document.querySelector('#movie-modal-image')
  const modalDate = document.querySelector('#movie-modal-date')
  const modalDescription = document.querySelector('#movie-modal-description')

  //避免顯示上一部資訊
  modalTitle.innerText = ''
  modalImage.firstElementChild.src = ''
  modalDate.innerText = ''
  modalDescription.innerText = ''

  axios.get(INDEX_URL + id)
    .then((response) => {
      // console.log(response)
      const data = response.data.results
      modalTitle.innerText = data.title
      //src 寫法，自己想起來的^^
      modalImage.firstElementChild.src = `${POSTER_URL + data.image}`
      //教案寫法
      // modalImage.innerHTML = `
      // <img src="${POSTER_URL + data.image}"
      // class="img-fluid" alt="Movie Poster">`
      modalDate.innerText = `Release date: ${data.release_date}`
      modalDescription.innerText = data.description
    })
}
function addToFavourite(id) {
  const list = JSON.parse(localStorage.getItem('favouriteMovies')) || []
  //原始寫法
  // const movie = movies.find(movieIsMatched) //arr.find() 裡是函式 會把 arr 每一個 el 當成參數丟進該函式篩選
  // function movieIsMatched(movie) { return movie.id === id }
  //箭頭函式
  const movie = movies.find((movie) => movie.id === id)
  if (list.some((movie) => movie.id === id)) { //若 some 的函式為真
    return alert('此部電影已加入收藏清單')
  }
  list.push(movie)
  localStorage.setItem('favouriteMovies', JSON.stringify(list))
}