import { Component, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'candidate-search',
  templateUrl: './candidate-search.component.html'
})
export class CandidateSearchComponent {
  public skills: Skill[];
  experience: number = 0;
  selectedSkills: any[] = [];
  _baseUrl: string;
  public candidatesFiltered: Candidate[];
  public candidatesSelected: string[] = [];
  public candidatesRejected: string[] = [];
  public candidatesSelectedList: Candidate[] = [];
  constructor(private http: HttpClient, @Inject('BASE_URL') baseUrl: string) {
    this._baseUrl = baseUrl;
    http.get<Skill[]>(baseUrl + 'JobSearch').subscribe(result => {
      this.skills = result;
    }, error => console.error(error));
  }

  search() {
    console.log(this.selectedSkills);
    console.log(this.experience);
    if (this.selectedSkills.length < 1) {
      alert('Select a skill !!');
      return;
    }
    if (this.experience < 0) {
      alert('Enter a valid experience !!');
      return;
    }
    this.http.post<Candidate[]>(this._baseUrl + 'JobSearch/search', { experience: this.experience, skills: this.selectedSkills }).subscribe(result => {
      this.candidatesFiltered = [];
      if (result) {
        result = result.filter(c => !this.candidatesSelected.includes(c.candidateId));
        result = result.filter(c => !this.candidatesRejected.includes(c.candidateId));
        this.candidatesFiltered = result;
      }
    }, error => console.error(error));
  }

  select(candidate) {
    this.candidatesSelected.push(candidate.candidateId);
    this.candidatesSelectedList.push(candidate);
    const index = this.candidatesFiltered.findIndex(c => c.candidateId == candidate.candidateId);
    if (index > -1) {
      this.candidatesFiltered.splice(index, 1);
    }
  }

  reject(candidateId) {
    this.candidatesRejected.push(candidateId);
    const index = this.candidatesFiltered.findIndex(c => c.candidateId == candidateId);
    if (index > -1) {
      this.candidatesFiltered.splice(index, 1);
    }
  }
}

interface Skill {
  name: string;
  guid: number;
}

interface Experience {
  yearsOfExperience: string;
  technologyId: string;
}

interface Candidate {
  candidateId: string;
  fullName: string;
  profilePicture: string;
  email: string;
  experience: Experience[];
}
