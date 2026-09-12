import View from './view.js';
import icons from 'url:../../img/icons.svg';

class PaginationView extends View{
    _parentElement=document.querySelector('.pagination');

    addHandlerClick(handler){
        this._parentElement.addEventListener('click',function(e){
            const btn = e.target.closest('.btn--inline');
            
            if(!btn) return ;

            const goToPage = +btn.dataset.goto;
            handler(goToPage);
        })
    }
    _generateMarkup(){
        const curPage=this._data.page;
        const numPages = Math.ceil( this._data.results.length/this._data.resultsPerPage);
        console.log(numPages);  
        //Page 1, and there are other pages

        if(curPage===1 && numPages> 1){

        return this._generateButton(curPage+1,'next');
        }

        //Last page
        if(curPage === numPages && numPages> 1){
    
        return this._generateButton(curPage-1,'prev');
        }

        //Other page
        if(curPage > 1 && curPage < numPages){

        return `${this._generateButton(curPage-1,'prev')}
                ${this._generateButton(curPage+1,'next')} `
        }

         //Page 1, and there are no other pages
         return ''


    }

    _generateButton(page,type){
        return`
        <button class="btn--inline pagination__btn--${type}" data-goto="${page}">
        ${type=== 'prev'?
            ` <svg class="search__icon">
              <use href="${icons}#icon-arrow-left"></use>
            </svg>
            <span>Page ${page}</span>
            `:
            `<span>Page ${page}</span>
            <svg class="search__icon">
            <use href="${icons}#icon-arrow-right"></use>
            </svg>`
        }
        </button>
        `
    }
};

export default new PaginationView();