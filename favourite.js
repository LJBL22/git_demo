//常數與變數
const BASE_URL = 'https://movie-list.alphacamp.io'
const INDEX_URL = BASE_URL + '/api/v1/movies/' // + ID
const POSTER_URL = BASE_URL + '/posters/' // + img
let movies = JSON.parse(localStorage.getItem('favouriteMovies')) || []
// const movies = []
const dataPanel = document.querySelector('#data-panel')

//函式
function renderMovieList(data) {
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
            <button type="button" class="btn btn-danger btn-remove-favourite" data-id="${item.id}">Ｘ</button>
          </div>
        </div>
      </div>
    `
    // dataPanel.innerHTML = HTMLContent
  })
  dataPanel.innerHTML = HTMLContent
}

function onPanelClick(event) {
  if (event.target.matches('.btn-show-movie')) {
    // console.log(event.event.target.dataset)
    showMovieModal(event.target.dataset.id) //--> 此處不一定要把 id 轉型別成 number 因為在 url 的部分算是多此一舉
  } else if (event.target.matches('.btn-remove-favourite')) {
    // movies = [] 模擬測試錯誤用
    removeFromFavourite(Number(event.target.dataset.id))
    // removeFromFavourite(5) 模擬測試錯誤用
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
      console.log(data);
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

function removeFromFavourite(id) {
  // 提取 localStorage 的該項目，  // 解析成 JSON 比較好看懂跟比對 > 在最前面 const movies 做 v
  // 將 id 與該 JSON 陣列比對 xx > 下一點
  //xxfind 則 removeItem > 好像不行 會整個 removexx --> findIndex()
  //找到該 index ，用 index 去刪除
  // console.log('no no');模擬測試錯誤用
  if (!movies || !movies.length) return //教案：錯誤處理，以防萬一
  // console.log('hi');模擬測試錯誤用
  const removedFilmIndex = movies.findIndex(movie => movie.id === id)
  if (removedFilmIndex === -1) return //教案：錯誤處理，以防萬一
  // console.log(removedFilmIndex);
  movies.splice(removedFilmIndex, 1)
  //直接把新的 movies 塞進去取代？ > 對 而且先 stringify
  localStorage.setItem('favouriteMovies', JSON.stringify(movies))
  renderMovieList(movies)
  //所以看起來用不到 removeItem ? 因為 item 都只有一個
}

//main code
renderMovieList(movies)
//監聽
dataPanel.addEventListener('click', onPanelClick)