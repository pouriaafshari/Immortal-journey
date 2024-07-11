import { AssetManagerBase, SkeletonData, Spine, SpineOptions } from '@pixi/spine-pixi';
import { Container, Assets, Application } from 'pixi.js';

// Class for handling the character Spine and its animations.
export class SpineCharacter
{
    constructor()
    {
        
        
    }

    async createSpine(app: Application){
        Assets.load("../assets/mix-and-match/export/mix-and-match-pro.json").then((resource: { spineData: SpineOptions | SkeletonData; }) => {
            const animation = new Spine(resource.spineData);
            app.stage.addChild(animation);
        
            // add the animation to the scene and render...
            app.stage.addChild(animation);
            
            if (true) {
                // run forever, little boy!
                animation.state.setAnimation(0, 'walk', true);
                // dont run too fast
                animation.state.timeScale = 0.1;
                // update yourself
                animation.autoUpdate = true;
            }
        });
    }
}
