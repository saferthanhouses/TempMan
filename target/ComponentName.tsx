import React from "react";
import {View} from 'react-native'

interface ComponentNameProps {}

const styles = StyleSheet.create({
    ComponentName: {
        flex: 1
    }
})

export default function ComponentName(props: ComponentNameProps){
    return (
        <View style={styles.ComponentName}></View>
    )
}
