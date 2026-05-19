import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ArticleBlogComponent } from './article-blog.component';

describe('ArticleBlogComponent', () => {
  let component: ArticleBlogComponent;
  let fixture: ComponentFixture<ArticleBlogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ArticleBlogComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ArticleBlogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
