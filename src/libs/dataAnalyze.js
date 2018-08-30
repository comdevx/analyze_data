/*
 * @Author: comdevx (comdevx@gmail.com) 
 * @Date: 2018-08-29 02:32:36 
 * @Last Modified by: ComdevX
 * @Last Modified time: 2018-08-31 01:10:32
 */

import _ from 'lodash'

export default (data, groupLimit) => {
    let result = []
    let no = 1
    data.forEach((pers, index) => {
        let arr = []
        data.forEach((pers2, index1) => {
            if (index !== index1) {
                arr.push({
                    name: pers2.name,
                    value: _.intersection(pers.data, pers2.data).length,
                    data: pers2.data
                })
            }
        })
        arr = arr.sort((a, b) => {
            return b.value - a.value
        })
        let arr2 = []
        const dup = checkDuplicate(result, pers.name)
        if (dup) {
            arr2.push({
                [pers.name]: no,
                data: pers.data,
                compare: '-'
            })
            result.push({
                [pers.name]: no,
                data: pers.data,
                compare: '-'
            })
        }
        let num = groupLimit - 1
        for (let i = 0; i < num; i++) {
            if (arr[i]) {
                const dup = checkDuplicate(result, arr[i].name)
                if (dup && arr2.length > 0) {
                    arr2.push({
                        [arr[i].name]: no,
                        data: arr[i].data,
                        compare: arr[i].value
                    })
                    result.push({
                        [arr[i].name]: no,
                        data: arr[i].data,
                        compare: arr[i].value
                    })
                    arr2.length === groupLimit && no++
                } else {
                    num++
                }
            }
        }
    })
    return result
}

const checkDuplicate = (data, value) => {
    for (let i = 0; i < data.length; i++) {
        const obj = Object.keys(data[i])[0]
        if (value === obj) {
            return false
        }
    }
    return true
}