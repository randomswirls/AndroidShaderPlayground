package com.example.laura.glshowandtell;


        import java.io.InputStream;
        import java.nio.ByteBuffer;
        import java.nio.ByteOrder;
        import java.nio.FloatBuffer;
        import java.nio.ShortBuffer;

        import android.content.res.AssetManager;
        import android.opengl.GLES20;
        import android.os.SystemClock;

/**
 * A two-dimensional square for use as a drawn object in OpenGL ES 2.0.
 */
public class Square {

    private final String vertexShaderCode =
            // This matrix member variable provides a hook to manipulate
            // the coordinates of the objects that use this vertex shader
                    "attribute vec4 vPosition;" +
                    "void main() {" +
                    // The matrix must be included as a modifier of gl_Position.
                    // Note that the uMVPMatrix factor *must be first* in order
                    // for the matrix multiplication product to be correct.
                    "  gl_Position = vPosition;" +
                    "}";

    private final String fragmentShaderCode =
            "precision mediump float;" +
                    "uniform vec4 vColor;" +
                    "uniform vec2 uScreen;" +
                    "uniform vec2 uMousePos;" +
                    "uniform float uTime;" +
                    "void main() {" +
                    "  gl_FragColor = vec4(gl_FragCoord.x/uScreen.x,uTime,0,1);" +
                    "}";

    private final FloatBuffer vertexBuffer;
    private final ShortBuffer drawListBuffer;
    private final int mProgram;

    // For vertex shader
    private int mPositionHandle;

    // For fragment shader
    private int mColorHandle;
    private int uScreenHandle;
    private int uMousePosHandle;
    private int uTimeHandle;

    // number of coordinates per vertex in this array
    static final int COORDS_PER_VERTEX = 3;
    static float squareCoords[] = {
            -1f,  1f, 0.0f,   // top left
            -1f, -1f, 0.0f,   // bottom left
            1f, -1f, 0.0f,   // bottom right
            1f,  1f, 0.0f }; // top right

    private final short drawOrder[] = { 0, 1, 2, 0, 2, 3 }; // order to draw vertices

    private final int vertexStride = COORDS_PER_VERTEX * 4; // 4 bytes per vertex

    public volatile float mScreen[] = {0f,0f};
    public volatile float mMouse[] = {-1f,-1f}; // TODO mouse if i need it
    private long mStartTime;

    float color[] = { 0.2f, 0.709803922f, 0.898039216f, 1.0f };

    /**
     * Sets up the drawing object data for use in an OpenGL ES context.
     */
    public Square( String frag ) {
        // initialize vertex byte buffer for shape coordinates
        ByteBuffer bb = ByteBuffer.allocateDirect(
                // (# of coordinate values * 4 bytes per float)
                squareCoords.length * 4);
        bb.order(ByteOrder.nativeOrder());
        vertexBuffer = bb.asFloatBuffer();
        vertexBuffer.put(squareCoords);
        vertexBuffer.position(0);

        // initialize byte buffer for the draw list
        ByteBuffer dlb = ByteBuffer.allocateDirect(
                // (# of coordinate values * 2 bytes per short)
                drawOrder.length * 2);
        dlb.order(ByteOrder.nativeOrder());
        drawListBuffer = dlb.asShortBuffer();
        drawListBuffer.put(drawOrder);
        drawListBuffer.position(0);

        // pick fragment shader
        String pickedFragment;
        if(frag.length()>0)
            pickedFragment = frag;
        else
            pickedFragment = fragmentShaderCode;

        // prepare shaders and OpenGL program
        int vertexShader = MyGLRenderer.loadShader(
                GLES20.GL_VERTEX_SHADER,
                vertexShaderCode);
        int fragmentShader = MyGLRenderer.loadShader(
                GLES20.GL_FRAGMENT_SHADER,
                pickedFragment);

        mProgram = GLES20.glCreateProgram();             // create empty OpenGL Program
        GLES20.glAttachShader(mProgram, vertexShader);   // add the vertex shader to program
        GLES20.glAttachShader(mProgram, fragmentShader); // add the fragment shader to program
        GLES20.glLinkProgram(mProgram);                  // create OpenGL program executables

        mStartTime = SystemClock.uptimeMillis();

    }

    /**
     * Encapsulates the OpenGL ES instructions for drawing this shape.
     *
     * @param mvpMatrix - The Model View Project matrix in which to draw
     * this shape.
     */
    public void draw() {
        // Add program to OpenGL environment
        GLES20.glUseProgram(mProgram);

        // get handle to vertex shader's vPosition member
        mPositionHandle = GLES20.glGetAttribLocation(mProgram, "vPosition");

        // Enable a handle to the triangle vertices
        GLES20.glEnableVertexAttribArray(mPositionHandle);

        // Prepare the triangle coordinate data
        GLES20.glVertexAttribPointer(
                mPositionHandle, COORDS_PER_VERTEX,
                GLES20.GL_FLOAT, false,
                vertexStride, vertexBuffer);

        // get handle to fragment shader's vColor member
       // mColorHandle = GLES20.glGetUniformLocation(mProgram, "vColor");
        uScreenHandle = GLES20.glGetUniformLocation(mProgram, "uScreen");
        uMousePosHandle = GLES20.glGetUniformLocation(mProgram, "uMousePos");
        uTimeHandle =  GLES20.glGetUniformLocation(mProgram, "uTime");

        // Set color for drawing the triangle
       // GLES20.glUniform4fv(mColorHandle, 1, color, 0);
        GLES20.glUniform2f(uScreenHandle,mScreen[0],mScreen[1]);
        GLES20.glUniform2f(uMousePosHandle,1f,1f);
        long time = SystemClock.uptimeMillis() - mStartTime;
        GLES20.glUniform1f(uTimeHandle,time/1000f);

        // get handle to shape's transformation matrix
       // mMVPMatrixHandle = GLES20.glGetUniformLocation(mProgram, "uMVPMatrix");
        //MyGLRenderer.checkGlError("glGetUniformLocation");

        // Apply the projection and view transformation
        //GLES20.glUniformMatrix4fv(mMVPMatrixHandle, 1, false, mvpMatrix, 0);
        //GLES20.glUniformMatrix4fv(mMVPMatrixHandle, 1, false, mvpMatrix, 0);
        //MyGLRenderer.checkGlError("glUniformMatrix4fv");

        // Draw the square
        GLES20.glDrawElements(
                GLES20.GL_TRIANGLES, drawOrder.length,
                GLES20.GL_UNSIGNED_SHORT, drawListBuffer);

        // Disable vertex array
        GLES20.glDisableVertexAttribArray(mPositionHandle);
    }

}