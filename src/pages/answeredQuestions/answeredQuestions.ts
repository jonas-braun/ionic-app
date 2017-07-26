import { Component } from '@angular/core';
import { NavController, ToastController } from 'ionic-angular';
import {QuestionServiceProvider} from "../../providers/question-service/question-service";
import {TagsHelper} from "../../utils/TagsHelper";
import {TranslateService} from "@ngx-translate/core";
import {AnswersPage} from "../answers/answers";
import {SearchQuestionsPage} from '../searchQuestions/searchQuestions';

@Component({
  selector: 'page-answeredQuestions',
  providers: [QuestionServiceProvider],
  templateUrl: 'answeredQuestions.html'
})
export class AnsweredQuestionsPage {
  //This contains all answered questions

  public questions: any;
  messageConnectionError;

  constructor(public navCtrl: NavController, public questionService: QuestionServiceProvider,
              public toastCtrl: ToastController, public translate: TranslateService, public tagsHelper: TagsHelper) {
    translate.get('CONNERROR', {value: 'world'}).subscribe((res: string) => {
      this.messageConnectionError = res;
    });
    this.loadQuestions(null);
    console.log("entered answered Questions View");
  }

  ionViewWillEnter() {
    this.loadQuestions(null);
    console.log("entered answered Questions View");
  }

  /**
   * Loads questions from server;
   * Input: refresher of view for reloading questions; null for initial loading call
   */
  loadQuestions(refresher) {
    console.log("load Questions");
    this.questionService.loadLikedQuestions().subscribe((data) => {
      if (data !== undefined && data !== []) {
        this.questions = data.map((question) => {
          return question;
        });
        if (refresher !== null) {
          refresher.complete();
        }
      } else {
        let toast = this.toastCtrl.create({
          message: this.messageConnectionError,
          duration: 3000
        });
        toast.present();
      }
    });
  }

  loadAnswerPage(question) {
    this.navCtrl.push(AnswersPage, {question: question});
  }

  loadSearchPageFunction(tag) {
    this.navCtrl.push(SearchQuestionsPage, {tag: tag});
  }

  loadTags(question) {
    return this.tagsHelper.getTagObjects(question.tags);
  }
}
