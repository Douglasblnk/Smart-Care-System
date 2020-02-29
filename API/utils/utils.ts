export class SSUtils {
  public verify(data : any, properties : Array<string>, defaultValue : any){
    if (data == null || data == undefined){
      return;
    }

    for (const element of properties){
      if (!data.hasOwnProperty(element)){
        data[element] = defaultValue;
      }
    }
  }
}