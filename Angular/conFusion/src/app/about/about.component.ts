import { Component, OnInit } from '@angular/core';
import { Leader } from '../shared/leader';
import { LeaderService } from '../services/leader.service';
import { flyInOut, expand } from '../animations/app.animation';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.scss'],
  host: {
    '[@flyInOut]': 'true',
    'style': 'display: block;'
  },
  animations: [
    flyInOut(),
    expand()
  ]
})
export class AboutComponent implements OnInit {

  leaders: Leader[];
  selectedLeader: Leader;
  leaderErrEesg: string;

  constructor(private leaderService: LeaderService) { }

  ngOnInit() {
    this.leaderService.getLeaders().subscribe(
      leaders => this.leaders = leaders,
      errmsg => this.leaderErrEesg = <any>errmsg);
  }

  onSelect(leader: Leader) {
    this.selectedLeader = leader;
  }

}
