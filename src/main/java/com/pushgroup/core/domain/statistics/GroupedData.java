package com.pushgroup.core.domain.statistics;

import java.util.List;

public class GroupedData {
    private GroupedDataName groupedName;
    private List<KeyValue> keyValues;

    public GroupedData(GroupedDataName groupedName, List<KeyValue> keyValues) {
        this.groupedName = groupedName;
        this.keyValues = keyValues;
    }

    public GroupedDataName getGroupedName() {
        return groupedName;
    }

    public void setGroupedName(GroupedDataName groupedName) {
        this.groupedName = groupedName;
    }

    public List<KeyValue> getKeyValues() {
        return keyValues;
    }

    public void setKeyValues(List<KeyValue> keyValues) {
        this.keyValues = keyValues;
    }
}
