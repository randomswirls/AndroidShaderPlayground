package com.example.laura.glshowandtell;

import android.content.Context;
import android.content.res.AssetManager;
import android.opengl.GLSurfaceView;
import android.view.MotionEvent;

import java.io.IOException;
import java.io.InputStream;

/**
 * A view container where OpenGL ES graphics can be drawn on screen.
 * This view can also be used to capture touch events, such as a user
 * interacting with drawn objects.
 */
public class MyGLSurfaceView extends GLSurfaceView {

    private final MyGLRenderer mRenderer;
    public static String fragfile;

    public MyGLSurfaceView(Context context) {
        super(context);

        // Create an OpenGL ES 2.0 context.
        setEGLContextClientVersion(2);

        // Set the Renderer for drawing on the GLSurfaceView
       // MyGLRenderer.fragmentFile = fragmentcode; // now in MainActivity
        mRenderer = new MyGLRenderer();
        setRenderer(mRenderer);

        // Render the view only when there is a change in the drawing data
       // setRenderMode(GLSurfaceView.RENDERMODE_WHEN_DIRTY);
    }

}
