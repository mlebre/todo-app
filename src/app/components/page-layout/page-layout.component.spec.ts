import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PageLayout } from './page-layout.component';

describe('PageLayout', () => {
    let component: PageLayout;
    let fixture: ComponentFixture<PageLayout>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [PageLayout],
        }).compileComponents();

        fixture = TestBed.createComponent(PageLayout);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should have empty title by default', () => {
        const raw = TestBed.createComponent(PageLayout);

        expect(raw.componentInstance.title).toBe('');
    });

    it('should render title input in heading', () => {
        component.title = 'Dashboard';
        fixture.detectChanges();

        const heading = fixture.nativeElement.querySelector('h1') as HTMLHeadingElement;
        expect(heading.textContent?.trim()).toBe('Dashboard');
    });
});
