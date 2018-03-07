var html = '<table class="onlinefs - datagrid ">                    
   <thead>                         
          <tr>                            ';if(attr.isindex){html+='                              
            <th width="34 px " ></th>                             ';}html+='                           
                 ';for(var i in slots){html+='                                    <th width="
';html+=slots[i].width;html +=' % " class="

';if(slots[i].isSort){html+='
onlinefs - datagrid - isSort ';}html+='
"                                         ';if(slots[i].isSort){html+='                    
                        onclick="
component_5.sort(';html+=i;html +=')
"                                        ';}html+='                    
                >';html+=slots[i].title;html +='                    
                                    ';if(state.sortColumn.index == i){html+='                                          
                                      ';if(state.sortColumn.isAsc){html+='                                              
                                      <img src=" / common / images / common - sort - asc.png " class="
onlinefs - datagrid - sort - img "/>                                     
       ';}else{html+='                                             
          <img src=" / common / images / common - sort - desc.png " class="
onlinefs - datagrid - sort - img "/>                                     
       ';}html+='                                     
          ';}html+='                                   
           </th>                                ';}html+='                       
                </tr>                        </thead>                        
                <tbody>         
                                       ';for(var i in state.rows){html+='               
                                                        <tr>                              
                                                                  ';if(attr.isindex){html+='                                      
                                                                    <td>';html+=parseInt(i)+1;html +='</td>                                   
                                                                     ';}html+='                                   
                                                                      ';for(var j in state.rows[i]){html+='                                    
                                                                          <td>';html+=state.rows[i][j];html +='</td>                                 
                                                                             ';}html+='                                </tr>                           
                                                                           ';}html+='                        </tbody>                   
                                                                            </table>';return html;

