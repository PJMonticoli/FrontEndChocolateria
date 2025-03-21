import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  ngOnInit(): void {
    let slides = document.querySelectorAll('.slide');
    let index = 0;

    setInterval(() => {
      slides[index].classList.remove('active'); 
      index = (index + 1) % slides.length; 
      slides[index].classList.add('active'); 
    }, 7000); 
  }
}
