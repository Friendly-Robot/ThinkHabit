package com.thinkhabit;

import android.app.Application;

import com.facebook.react.ReactApplication;
import com.google.android.gms.ads.MobileAds;
import com.sbugert.rnadmob.RNAdMobPackage;
import com.wenkesj.voice.VoicePackage;
import com.dooboolab.RNIap.RNIapPackage;
import com.imagepicker.ImagePickerPackage;
import com.wix.autogrowtextinput.AutoGrowTextInputPackage;
import com.oblador.vectoricons.VectorIconsPackage;
import com.dieam.reactnativepushnotification.ReactNativePushNotificationPackage;
import com.github.xinthink.rnmk.ReactMaterialKitPackage;
import io.realm.react.RealmReactPackage;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.react.shell.MainReactPackage;
import com.facebook.soloader.SoLoader;

import java.util.Arrays;
import java.util.List;

public class MainApplication extends Application implements ReactApplication {

  private final ReactNativeHost mReactNativeHost = new ReactNativeHost(this) {
    @Override
    public boolean getUseDeveloperSupport() {
      return BuildConfig.DEBUG;
    }

    @Override
    protected List<ReactPackage> getPackages() {
      return Arrays.<ReactPackage>asList(
          new MainReactPackage(),
            new RNAdMobPackage(),
            new VoicePackage(),
            new RNIapPackage(),
            new ImagePickerPackage(),
            new AutoGrowTextInputPackage(),
            new VectorIconsPackage(),
            new ReactNativePushNotificationPackage(),
            new ReactMaterialKitPackage(),
            new RealmReactPackage()
      );
    }

    @Override
    protected String getJSMainModuleName() {
      return "index";
    }
  };

  @Override
  public ReactNativeHost getReactNativeHost() {
    return mReactNativeHost;
  }

  @Override
  public void onCreate() {
    super.onCreate();
    SoLoader.init(this, /* native exopackage */ false);
    MobileAds.initialize(this, "ca-app-pub-6795803926768626~8363743121");
  }
}
