import { By } from "@angular/platform-browser";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { AppComponent } from "../app.component";
import { BookListComponent } from "../book-list/book-list.component";
import { HttpClientTestingModule } from "@angular/common/http/testing";
import { BookCollectionComponent } from "../book-collection/book-collection.component";
import { booksReducer } from "../state/books.reducer";
import { StoreModule } from "@ngrx/store";
import { collectionReducer } from "../state/collection.reducer";
import { GoogleBooksService } from "../book-list/books.service";
import { DebugElement } from "@angular/core";
import { HttpClientModule } from "@angular/common/http";

describe('buttons should work as expected', () => {
  let fixture: ComponentFixture<AppComponent>;
  let component: AppComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AppComponent, BookListComponent, BookCollectionComponent],
      imports: [
        //HttpClientTestingModule,
        HttpClientModule,
        StoreModule.forRoot({
          books: booksReducer,
          collection: collectionReducer,
        }),
      ],
      providers: [GoogleBooksService],
    }).compileComponents();

    fixture = TestBed.createComponent(AppComponent);
    component = fixture.debugElement.componentInstance;
    fixture.detectChanges();
  });

  it('should add to collection when add button is clicked and remove from collection when remove button is clicked', () => {
    fixture.whenStable().then(() => {
      const addButton = getBookList()[1].query(
        By.css('[data-test=add-button]')
      );

      click(addButton);
      expect(getBookTitle(getCollection()[0])).toBe('Second Title');

      const removeButton = getCollection()[0].query(
        By.css('[data-test=remove-button]')
      );
      click(removeButton);

      expect(getCollection().length).toBe(0);
    });
  });

  //functions used in the above test
  function getCollection() {
    return fixture.debugElement.queryAll(By.css('.book-collection .book-item'));
  }

  function getBookList() {
    return fixture.debugElement.queryAll(By.css('.book-list .book-item'));
  }

  function getBookTitle(element: DebugElement) {
    return element.query(By.css('p')).nativeElement.textContent;
  }

  function click(element: DebugElement) {
    const el: HTMLElement = element.nativeElement;
    el.click();
    fixture.detectChanges();
  }
});
