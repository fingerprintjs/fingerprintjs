package {
  import flash.display.Sprite;
  import flash.display.LoaderInfo;
  import flash.text.Font;
  import flash.text.FontType;
  import flash.text.FontStyle;
  import flash.external.*;
  
  public class FontList extends Sprite {
    
    public function FontList() {
      var params:Object = loadParams();
      loadExternalInterface(params);
    }
    
    private function loadParams():Object {
      return LoaderInfo(this.root.loaderInfo).parameters;
    }
    
    private function loadExternalInterface(params:Object):void {
      ExternalInterface.marshallExceptions = true;
      ExternalInterface.addCallback("fonts", fonts);
      ExternalInterface.call(params.onReady, params.swfObjectId);
    }
    
    public function fonts():Array {
      var fontNames:Array = [];
      for each (var font:Font in Font.enumerateFonts(true) )
      {
        fontNames.push(font.fontName);
      }
      return fontNames;
    }
  }
}
