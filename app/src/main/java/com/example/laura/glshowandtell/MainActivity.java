package com.example.laura.glshowandtell;

import android.content.Intent;
import android.support.v7.app.AppCompatActivity;
import android.os.Bundle;
import android.widget.AdapterView;
import android.widget.ArrayAdapter;
import android.view.View;
import android.widget.ListView;
import android.widget.Toast;

import java.io.File;
import java.io.IOException;
import java.io.InputStream;

public class MainActivity extends AppCompatActivity {

    private int mSelectedIndex=0;
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        String[] valuesexample = new String[] { "Android", "iPhone", "WindowsMobile",
                "Blackberry", "WebOS", "Ubuntu", "Windows7", "Max OS X",
                "Linux", "OS/2" };

        String[] values= new String[0];
        try {
            values = getAssets().list("FragmentShaders");
        } catch (IOException e) {
            e.printStackTrace();
        }
        ArrayAdapter<String> adapter = new ArrayAdapter<String>(this,
                android.R.layout.simple_list_item_1, values);

        final ListView programsListView = (ListView) findViewById(R.id.programsList);
        programsListView.setAdapter(adapter);

        programsListView.setOnItemClickListener(new AdapterView.OnItemClickListener() {

            @Override
            public void onItemClick(AdapterView<?> parent, final View view,
                                    int position, long id) {
                mSelectedIndex = position;
            }

        });



    }

    /*@Override
    protected void onListItemClick(ListView l, View v, int position, long id) {
        String item = (String) getListAdapter().getItem(position);
        Toast.makeText(this, item + " selected", Toast.LENGTH_LONG).show();
    }*/

    public void launchGLActivity(View view)
    {
        Intent intent = new Intent(this, MyGLActivity.class);

        final ListView programsListView = (ListView) findViewById(R.id.programsList);
        //String selected = (String) programsListView.getSelectedItem();
        //if(selected!=null)
        //    selected = (String) programsListView.getItemAtPosition(0);
        String selected = (String) programsListView.getItemAtPosition(mSelectedIndex);

        String fragmentcode = "";

        try {
            InputStream input = getAssets().open("FragmentShaders"+File.separator+ selected);
            //InputStream input = getAssets().open("FragmentShaders/sonic.frag");

            int size = input.available();
            byte[] buffer = new byte[size];
            input.read(buffer);
            input.close();

            // byte buffer into a string
            fragmentcode = new String(buffer);

        } catch (IOException e) {
            e.printStackTrace();
        }

        MyGLRenderer.fragmentFile = fragmentcode;
        startActivity(intent);
    }



}

class User {
    public String name;
    public String hometown;
    public User(String name, String hometown) {
        this.name = name;
        this.hometown = hometown;
    }
}