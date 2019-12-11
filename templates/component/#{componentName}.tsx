import React from "react";
import {View} from 'react-native'

interface #{componentName}Props {}

const styles = StyleSheet.create({
    {#componentName}: {
        flex: 1
    }
})

export default function #{componentName}(props: #{componentName}Props){
    return (
        <View style={styles.#{componentName}}></View>
    )
}
