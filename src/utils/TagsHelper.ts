import { Storage } from '@ionic/storage';
import { ToastController } from 'ionic-angular';
import {TagsServiceProvider} from "../providers/tags-service/tags-service";
import { Injectable} from "@angular/core";
import {TranslateService} from "@ngx-translate/core";

@Injectable()
export class TagsHelper {

  public allTagObjects = [];
  messageConnectionError;

  constructor(public storage: Storage, public tagsService: TagsServiceProvider, public toastCtrl: ToastController, public translate: TranslateService) {
    translate.get('CONNERROR', {value: 'world'}).subscribe((res: string) => {
      this.messageConnectionError = res;
    });
  }

  //GET all possible tags from server & store in local storage
  loadAllTagObjects() {
    this.tagsService.loadAllTags().subscribe(data => {
      if (data !== undefined && data !== [] && data !== null) {
        console.log(data);
        this.storage.set('allTags', data);
        this.allTagObjects = data;
      }
    });
  }

  getAllTagObjects() {
    if (this.allTagObjects === [] || this.allTagObjects === null) {
      this.loadAllTagObjects();
    }
    if(this.allTagObjects === undefined){
      let toast = this.toastCtrl.create({
        message: this.messageConnectionError,
        duration: 3000
      });
      toast.present();
    }
    return this.allTagObjects;
  }

  //Get tag objects by id
  getTagObjects(tagIds) {
    if (this.allTagObjects === [] || this.allTagObjects === null) {
      this.loadAllTagObjects();
    }
    let tags = [];
    if(this.allTagObjects === undefined){
      let toast = this.toastCtrl.create({
        message: this.messageConnectionError,
        duration: 3000
      });
      toast.present();
    }
    else{
      for (let i = 0; i < tagIds.length; i++) {
        tags.push(this.allTagObjects.find((tag) => {
          return (tag.id === tagIds[i]);
        }));
      }
    }
    return tags;
  }

  getAllTagObjectsSorted() {
    var tags = this.getAllTagObjects();
    tags.sort(function(a, b) {
      var tagA = a.text.toUpperCase(); // ignore upper and lowercase
      var tagB = b.text.toUpperCase(); // ignore upper and lowercase
      if (tagA < tagB) {
        return -1;
      }
      if (tagA > tagB) {
        return 1;
      }
      return 0;
    });
    console.log(tags);
    return tags;
  }

}
