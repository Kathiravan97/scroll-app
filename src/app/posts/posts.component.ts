import { AfterViewInit, ChangeDetectionStrategy, Component, NgZone, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { PostsService } from './posts.service';
import { CdkVirtualScrollViewport, ScrollingModule } from '@angular/cdk/scrolling';
import { MatCard, MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatListModule } from '@angular/material/list'; // Import the MatListModule to use the mat-list component.
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { filter, map, pairwise, throttleTime, timer } from 'rxjs';

@Component({
  selector: 'app-posts',
  standalone: true,
  imports: [MatListModule, ScrollingModule, MatCardModule, MatIconModule, MatButtonModule, MatProgressSpinnerModule],
  templateUrl: './posts.component.html',
  styleUrl: './posts.component.css',
  providers: [PostsService],  // Import the PostsService here to use it in the component.
  changeDetection: ChangeDetectionStrategy.Default
})
export class PostsComponent implements OnInit, AfterViewInit, OnDestroy {

  posts: any[] = [];
  loading = false;

  @ViewChild(CdkVirtualScrollViewport) scroller!: CdkVirtualScrollViewport;


  constructor(private _postsService: PostsService, private ngZone: NgZone) {
  }

  ngOnInit(): void {
    this.fetchPosts();
  }

  ngAfterViewInit() {
    this.scroller.elementScrolled().pipe(
      map(() => this.scroller.measureScrollOffset("bottom")),
      pairwise(),
      filter(([y1, y2]) => (y1 > y2) && (y2 < 140)),
      throttleTime(200)
    ).subscribe(() => {
      this.ngZone.run(() => {
        this.fetchPosts()
      });
    });
  }

  ngOnDestroy() {

  }

  fetchPosts(): void {
    this.loading = true;
    this._postsService.getPhotos().subscribe((posts: any[]) => {
      timer(1000).subscribe(() => {
        this.loading = false;
        this.posts = [...this.posts, ...posts];
      });

    });
    console.log(this.posts);
  }

}
