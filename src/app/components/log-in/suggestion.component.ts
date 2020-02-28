import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-log-in',
  templateUrl: './suggestion.component.html',
  styleUrls: ['./suggestion.component.scss']
})
export class SuggestionComponent implements OnInit {

  endpoint = 'http://0.0.0.0:5000/';
  answers: any = [];
  message = '';
  files: any[] = [];
  paper_text: string;

  constructor(private http: HttpClient) { }

  ngOnInit() {
  }

  getData(formData) {

  }


  onClickUpload() {
    let fileToUpload = this.files[0];
    let formData = new FormData();
    formData.append('file', fileToUpload, fileToUpload.name);
    // formData.append('responseType', 'text', );
    this.http.post(this.endpoint + 'upload_pdf', formData).subscribe((val) => {
      this.paper_text = val['paper'];
      console.log(this.paper_text);
    });
    return false;
  }

  onClickAsk(formData) {
    this.http.post(this.endpoint + 'ask_paper',
      {
        "paper": this.paper_text,
        "question": formData.text
      })
      .subscribe((val) => {
        console.log(val['answer']);
        this.answers = val['answer'];
        this.message = val['answer'][0];
      });
  }


  onFileDropped($event) {
    this.prepareFilesList($event);
  }

  /**
   * handle file from browsing
   */
  fileBrowseHandler(files) {
    this.prepareFilesList(files);
  }

  /**
   * Delete file from files list
   * @param index (File index)
   */
  deleteFile(index: number) {
    this.files.splice(index, 1);
  }

  /**
   * Simulate the upload process
   */
  uploadFilesSimulator(index: number) {
    setTimeout(() => {
      if (index === this.files.length) {
        return;
      } else {
        const progressInterval = setInterval(() => {
          if (this.files[index].progress === 100) {
            clearInterval(progressInterval);
            this.uploadFilesSimulator(index + 1);
          } else {
            this.files[index].progress += 5;
          }
        }, 200);
      }
    }, 1000);
  }

  /**
   * Convert Files list to normal array list
   * @param files (Files List)
   */
  prepareFilesList(files: Array<any>) {
    for (const item of files) {
      item.progress = 0;
      this.files.push(item);
    }
    this.uploadFilesSimulator(0);
  }

  /**
   * format bytes
   * @param bytes (File size in bytes)
   * @param decimals (Decimals point)
   */
  formatBytes(bytes, decimals) {
    if (bytes === 0) {
      return '0 Bytes';
    }
    const k = 1024;
    const dm = decimals <= 0 ? 0 : decimals || 2;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
  }

}
