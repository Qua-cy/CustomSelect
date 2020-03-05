(function (){
    let methods = {
        $: function (selector, parentEl = document) {
            return parentEl.querySelector(selector);
        },
        $$: function (selector, parentEl = document) {
            return parentEl.querySelectorAll(selector);
        }
    }

    let isShow = true;  //demo-list显示隐藏标志符
    let inputBox = methods.$('.input-box');
    let demoList = methods.$('#demo-list');
    let descBefore = methods.$('#desc-before');
    let descCur = methods.$('#desc-current');
    let descWrap = methods.$('.desc-wrap');

    let Search = function (data) {
        this._init();
        this._createEl(data);//创建所有li并插入到页面中
        this._filter();//监听oninput事件，利用innerHtml把包含有搜索字符的li标签放进各自的ul。
        this._showHide();//点击demoSelect事件,demo-list显示隐藏
        this.lis = methods.$$('li', demoList);
        this._clickLiEvent(this.lis);//点击li，填充点击的文本到demoSelect框中，并且点击前后的描述文本
        this.allLisInnerText = [];
        this.lis.forEach((liItem) => {
            this.allLisInnerText.push(liItem.innerText);
        })
    }

    Search.prototype._init = function () {
        this.classfyPattern = '';
        this.beforeSelect = [['未选择','undefined']];//保存之前li文本和index
    }

    Search.prototype._createEl = function (data) {
        let searchBoxHtml = '<div><input type="text" class="search-box" placeholder="搜索" ></div>';

        data.forEach((item) => {
            let classfyTitle = item.type;
            let itemName = item.name;
            let lis = ''

            for(let item of itemName){
                lis += `<li>${ item }</li>`;
            };

            this.classfyPattern += `<div class="classfy-list-wrap"><h4 class="class-list-title">${ classfyTitle }</h4><ul class="list-item">${ lis }</ul></div>`;

        });
        demoList.innerHTML = searchBoxHtml + this.classfyPattern;
    }

    
    Search.prototype._filter = function () {
        let searchBox = methods.$('.search-box');
        let listItem = methods.$$('.list-item');//获取ul
        let liArr = [];//保存每组li节点
        
        listItem.forEach((ul) => {
            liArr.push(ul.innerHTML);
        });

        searchBox.addEventListener('click', (e) => {
            e.stopPropagation();
        })
 
        searchBox.addEventListener('input',(e) => {
            let reg = new RegExp(`(${ searchBox.value })`, 'ig');

            listItem.forEach((ul, index) => {
                // ul.innerHTML = '';
                ul.innerHTML = liArr[index];
                let lis = methods.$$('li', ul);

                lis.forEach((li) => {
                    // indexOf是区分大小写的,这里采用正则。

                    // if(li.innerText.indexOf(searchBox.value) == -1){
                    //     ul.removeChild(li);
                    // }

                    if(reg.test(li.innerText) == false){
                        ul.removeChild(li);
                    }
                })
            })

            // 筛选后再次调用点击li事件
            let selectedLis = methods.$$('li', demoList);
            // console.log(selectedLis)
            // console.log(this.allLisInnerText)
            this._clickLiEvent(selectedLis);
           
        })
    }

    Search.prototype._showHide = function () {
        let demoSelect = methods.$('.demo-select');
        
        demoSelect.addEventListener('click', (e) => {
            e.stopPropagation();
            if(isShow){
                demoList.style.display = 'block';
                setTimeout(() => {
                    demoList.style.opacity = 1;
                    demoList.style.transform = 'scale(1,1) translate(0,0)';
                })
                isShow = false;
            }else{
                demoList.style.opacity = 0;
                demoList.style.transform = 'scale(1,0) translate(0,100%)';
                setTimeout(() => {
                    demoList.style.display = 'none';
                },300);
                isShow = true;
            }
        })

        document.addEventListener('click', () => {
            if(!isShow){
                demoList.style.opacity = 0;
                demoList.style.transform = 'scale(1,0) translate(0,100%)';
                setTimeout(() => {
                    demoList.style.display = 'none';
                },300);
                isShow = true;
            }
        })
    }

    // [li.innerText,...]保存所有li的innerText,点击当前的li的innertext的如果跟该数组里面的相同，从数组里面输出下标和值。
    

    Search.prototype._clickLiEvent = function (selectedLis) {

        selectedLis.forEach((liItem,index) => {
            // 点击按下鼠标到当前li，改变背景色和字体色
            liItem.addEventListener('mousedown', (e) => {
                e.target.style.backgroundColor = '#4e77fd';
                e.target.style.color = '#fff';
            })

            // 放开鼠标回复li背景色和字体色，添加当前文本和之前的文本。
            liItem.addEventListener('mouseup', (e) => {
                let curLiText = e.target.innerText;
                // console.log(this.allLisInnerText)

                e.target.style.backgroundColor = '';
                e.target.style.color = '';

                inputBox.value = curLiText; 
                if(this.beforeSelect.length == 1){
                    descBefore.innerText = `${ this.beforeSelect[0][0] } - ${ this.beforeSelect[0][1] }`;
                }else{
                    descBefore.innerText = `${ this.beforeSelect[1][0] } - ${ this.beforeSelect[1][1] }`;
                }
                
                let index = this.allLisInnerText.indexOf(curLiText);
                descCur.innerText = `${ curLiText } - ${ index + 1 }`;

                this.beforeSelect.push([curLiText,index + 1]);

                if(this.beforeSelect.length > 2){
                    this.beforeSelect.splice(0,1);
                } 
                // console.log(this.beforeSelect)
                if(this.beforeSelect.length == 2){
                    descWrap.style.display = 'block';
                }
            })
        })
    }
    
    window.$Search = Search;
})();